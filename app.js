/*
 * App — UI logik, event handlers, chart rendering.
 */

(function () {
  // --- Populate dropdowns ---
  const evSelect = document.getElementById("evSelect");
  const benzinSelect = document.getElementById("benzinSelect");

  CAR_DATA.ev.forEach((car) => {
    const opt = document.createElement("option");
    opt.value = car.id;
    opt.textContent = car.name;
    evSelect.appendChild(opt);
  });

  CAR_DATA.benzin.forEach((car) => {
    const opt = document.createElement("option");
    opt.value = car.id;
    opt.textContent = car.name;
    benzinSelect.appendChild(opt);
  });

  // --- Show specs on selection ---
  function formatKr(n) {
    return n.toLocaleString("da-DK") + " kr";
  }

  function showSpecs(car, type, container) {
    if (!car) {
      container.innerHTML = "";
      return;
    }
    const consumptionUnit = type === "ev" ? "kWh/100km" : "l/100km";
    const taxLabel = type === "ev" ? "Grøn ejerafgift" : "Vægtafgift";
    container.innerHTML = `
      <div class="spec-row"><span>Pris</span><strong>${formatKr(car.price)}</strong></div>
      <div class="spec-row"><span>Forbrug</span><strong>${car.consumption} ${consumptionUnit}</strong></div>
      <div class="spec-row"><span>${taxLabel}</span><strong>${formatKr(car.tax)}/år</strong></div>
      <div class="spec-row"><span>Forsikring</span><strong>${formatKr(car.insurance)}/år</strong></div>
      <div class="spec-row"><span>Vedligeholdelse</span><strong>${formatKr(car.maintenance)}/år</strong></div>
    `;
  }

  evSelect.addEventListener("change", () => {
    const car = CAR_DATA.ev.find((c) => c.id === evSelect.value);
    showSpecs(car, "ev", document.getElementById("evSpecs"));
  });

  benzinSelect.addEventListener("change", () => {
    const car = CAR_DATA.benzin.find((c) => c.id === benzinSelect.value);
    showSpecs(car, "benzin", document.getElementById("benzinSpecs"));
  });

  // --- Calculate ---
  document.getElementById("calcBtn").addEventListener("click", () => {
    const evCar = CAR_DATA.ev.find((c) => c.id === evSelect.value);
    const benzinCar = CAR_DATA.benzin.find(
      (c) => c.id === benzinSelect.value
    );

    if (!evCar || !benzinCar) {
      alert("Vælg venligst både en elbil og en benzinbil.");
      return;
    }

    const params = {
      kmPerYear: parseInt(document.getElementById("kmPerYear").value) || 15000,
      ownerYears:
        parseInt(document.getElementById("ownerYears").value) || 5,
      elPrice:
        parseFloat(document.getElementById("elPrice").value) || 2.5,
      benzinPrice:
        parseFloat(document.getElementById("benzinPrice").value) || 13.5,
    };

    const evResult = calculateTotalCost(evCar, params, "ev");
    const benzinResult = calculateTotalCost(benzinCar, params, "benzin");

    showResults(evCar, benzinCar, evResult, benzinResult, params);
    showBreakeven(evCar, benzinCar, params);

    document.getElementById("resultater").style.display = "";
    document.getElementById("breakeven").style.display = "";

    // Scroll to results
    document
      .getElementById("resultater")
      .scrollIntoView({ behavior: "smooth" });
  });

  // --- Show Results ---
  function showResults(evCar, benzinCar, evR, benzinR, params) {
    document.getElementById("evSummaryName").textContent = evCar.name;
    document.getElementById("evSummaryTotal").textContent = formatKr(evR.total);
    document.getElementById("evSummaryMonthly").textContent =
      formatKr(evR.monthlyAvg) + "/md";

    document.getElementById("benzinSummaryName").textContent = benzinCar.name;
    document.getElementById("benzinSummaryTotal").textContent = formatKr(
      benzinR.total
    );
    document.getElementById("benzinSummaryMonthly").textContent =
      formatKr(benzinR.monthlyAvg) + "/md";

    // Difference banner
    const diff = benzinR.total - evR.total;
    const banner = document.getElementById("diffBanner");
    if (diff > 0) {
      banner.className = "card diff-banner reveal ev-wins";
      banner.innerHTML = `<strong>Elbilen er ${formatKr(diff)} billigere</strong> over ${params.ownerYears} år`;
    } else if (diff < 0) {
      banner.className = "card diff-banner reveal benzin-wins";
      banner.innerHTML = `<strong>Benzinbilen er ${formatKr(Math.abs(diff))} billigere</strong> over ${params.ownerYears} år`;
    } else {
      banner.className = "card diff-banner reveal";
      banner.innerHTML = "<strong>Begge biler koster det samme!</strong>";
    }

    // Breakdown table
    const rows = [
      ["Brændstof / el", evR.fuelTotal, benzinR.fuelTotal],
      ["Afgifter", evR.taxTotal, benzinR.taxTotal],
      ["Forsikring", evR.insuranceTotal, benzinR.insuranceTotal],
      ["Vedligeholdelse", evR.maintenanceTotal, benzinR.maintenanceTotal],
      ["Værditab", evR.depreciationTotal, benzinR.depreciationTotal],
      ["Total", evR.total, benzinR.total],
    ];

    let tableHtml = `
      <div class="breakdown-row breakdown-header">
        <div class="breakdown-cell">Omkostning</div>
        <div class="breakdown-cell">⚡ ${evCar.name}</div>
        <div class="breakdown-cell">⛽ ${benzinCar.name}</div>
        <div class="breakdown-cell">Forskel</div>
      </div>
    `;

    rows.forEach(([label, evVal, benzinVal], idx) => {
      const rowDiff = benzinVal - evVal;
      const isTotal = idx === rows.length - 1;
      const diffClass =
        rowDiff > 0
          ? "diff-positive"
          : rowDiff < 0
          ? "diff-negative"
          : "";
      const diffText =
        rowDiff > 0
          ? "+" + formatKr(rowDiff)
          : rowDiff < 0
          ? "-" + formatKr(Math.abs(rowDiff))
          : "0 kr";

      tableHtml += `
        <div class="breakdown-row${isTotal ? " breakdown-total" : ""}">
          <div class="breakdown-cell">${label}</div>
          <div class="breakdown-cell">${formatKr(evVal)}</div>
          <div class="breakdown-cell">${formatKr(benzinVal)}</div>
          <div class="breakdown-cell ${diffClass}">${diffText}</div>
        </div>
      `;
    });

    document.getElementById("breakdownTable").innerHTML = tableHtml;
  }

  // --- Break-even chart (canvas) ---
  function showBreakeven(evCar, benzinCar, params) {
    const data = calculateBreakeven(evCar, benzinCar, params);
    const canvas = document.getElementById("breakevenChart");
    const ctx = canvas.getContext("2d");

    // High DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width - 48; // padding
    const h = 400;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const maxVal = Math.max(
      ...data.evPoints,
      ...data.benzinPoints
    );
    const padLeft = 80;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 50;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    // Grid
    ctx.strokeStyle = "#E5E5E5";
    ctx.lineWidth = 1;
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = padTop + (chartH / ySteps) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + chartW, y);
      ctx.stroke();

      const val = maxVal - (maxVal / ySteps) * i;
      ctx.fillStyle = "#999";
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.round(val / 1000) + "k", padLeft - 10, y + 4);
    }

    // X labels
    const totalMonths = data.maxMonths;
    const xLabelStep = totalMonths <= 36 ? 6 : 12;
    ctx.fillStyle = "#999";
    ctx.textAlign = "center";
    for (let m = 0; m <= totalMonths; m += xLabelStep) {
      const x = padLeft + (m / totalMonths) * chartW;
      if (m % 12 === 0) {
        ctx.fillText(m / 12 + " år", x, h - padBottom + 30);
      } else {
        ctx.fillText(m + " md", x, h - padBottom + 30);
      }
    }

    // Draw line
    function drawLine(points, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.beginPath();
      points.forEach((val, i) => {
        const x = padLeft + (i / totalMonths) * chartW;
        const y = padTop + chartH - (val / maxVal) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    drawLine(data.evPoints, "#22C55E");
    drawLine(data.benzinPoints, "#EF4444");

    // Break-even line
    if (data.breakevenMonth !== null) {
      const bx = padLeft + (data.breakevenMonth / totalMonths) * chartW;
      ctx.strokeStyle = "#D4FF00";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(bx, padTop);
      ctx.lineTo(bx, padTop + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#111";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center";
      const years = Math.floor(data.breakevenMonth / 12);
      const months = data.breakevenMonth % 12;
      let label = "";
      if (years > 0) label += years + " år";
      if (months > 0) label += (years > 0 ? " " : "") + months + " md";
      ctx.fillText("Break-even: " + label, bx, padTop - 5);
    }

    // Note
    const note = document.getElementById("breakevenNote");
    if (data.breakevenMonth !== null) {
      const years = Math.floor(data.breakevenMonth / 12);
      const months = data.breakevenMonth % 12;
      let timeStr = "";
      if (years > 0) timeStr += years + " år";
      if (months > 0) timeStr += (years > 0 ? " og " : "") + months + " måneder";
      note.textContent = `Elbilen bliver billigere efter ca. ${timeStr}.`;
    } else {
      note.textContent =
        "Elbilen bliver ikke billigere end benzinbilen inden for den valgte ejerperiode.";
    }
  }

  // --- Mobile nav ---
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navLinks.classList.toggle("open");
    document.body.style.overflow = navLinks.classList.contains("open")
      ? "hidden"
      : "";
    navToggle.setAttribute(
      "aria-expanded",
      navToggle.classList.contains("active")
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navLinks.classList.remove("open");
      document.body.style.overflow = "";
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // --- Scroll reveal ---
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!prefersReduced) {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${i * 60}ms`;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
    setTimeout(() => {
      reveals.forEach((el) => el.classList.add("visible"));
    }, 3000);
  } else {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("visible"));
  }
})();
