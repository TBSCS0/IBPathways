document.addEventListener("DOMContentLoaded", function () {
  const groups = [
    { name: "linguagens", minRequired: 2 },
    { name: "linguagem_aquisicao", minRequired: 1 },
    { name: "individuos_sociedades", minRequired: 1 },
    { name: "ciencias", minRequired: 2 },
    { name: "matematica", minRequired: 1 },
    { name: "artes", minRequired: 1 }
  ];

  // Disable all groups except the first
  for (let i = 1; i < groups.length; i++) {
    toggleGroup(groups[i].name, false);
  }

  // Attach listeners to checkboxes to track changes
  groups.forEach((group, index) => {
    const checkboxes = document.querySelectorAll(`input[name="${group.name}"]`);
    checkboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        validateGroup(index + 1); // enable next group if criteria met
      });
    });
  });

  function countChecked(name) {
    return document.querySelectorAll(`input[name="${name}"]:checked`).length;
  }

  function toggleGroup(name, enable) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
    checkboxes.forEach(cb => {
      cb.disabled = !enable;
      if (!enable) cb.checked = false;
    });
    updateDisabledLabels(); // ensure styling reflects current state
  }

  function validateGroup(index) {
    if (index >= groups.length) return;

    const prev = groups[index - 1];
    const current = groups[index];

    const checkedCount = countChecked(prev.name);
    if (checkedCount >= prev.minRequired) {
      toggleGroup(current.name, true);
    } else {
      toggleGroup(current.name, false);
    }

    // recursively disable all following groups
    for (let i = index + 1; i < groups.length; i++) {
      toggleGroup(groups[i].name, false);
    }
  }
});

function updateDisabledLabels() {
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    const label = cb.closest('label');
    if (label) {
      label.classList.toggle('disabled-label', cb.disabled);
    }
  });
}

function preventDualSelection(option1, option2, message) {
  const cb1 = document.querySelector(`input[value="${option1}"]`);
  const cb2 = document.querySelector(`input[value="${option2}"]`);

  [cb1, cb2].forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb1.checked && cb2.checked) {
        alert(message);
        cb.checked = false;
      }
    });
  });
}

preventDualSelection("portuguese_hl", "portuguese_sl", "You cannot select both Portuguese A - HL and SL. Please choose only one.");
preventDualSelection("english_hl", "english_sl", "You cannot select both English A - HL and SL. Please choose only one.");

function enforceSingleSelection(groupName) {
  const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        checkboxes.forEach(other => {
          if (other !== cb) other.checked = false;
        });
      }
      setItinerarioFormativo();
    });
  });
}

enforceSingleSelection("linguagem_aquisicao");

function enforceGroup3Logic() {
  const checkboxes = document.querySelectorAll('input[name="individuos_sociedades"]');
  const historyOptions = ["history_hl", "history_sl"];
  const geographyOptions = ["geography_hl", "geography_sl"];
  const BSSOptions = ["bss_hl", "bss_sl"];

  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      // Uncheck all others
      if (cb.checked) {
        checkboxes.forEach(other => {
          if (other !== cb) other.checked = false;
        });

        const selected = cb.value;

        const isHistory = historyOptions.includes(selected);
        const isGeography = geographyOptions.includes(selected);
        const isBSS = BSSOptions.includes(selected);

        if (isHistory) {
          alert("You have to do Geography in BEC");
        } else if (isGeography) {
          alert("You have to do History in BEC");
        } else if (isBSS){
          alert("You don't have to do human sciences in BEC");
        } else {
          alert("You have to do Geography and History in BEC");
        }
      }
      updateBECList();
      setItinerarioFormativo();
    });
  });
}

// Call the function
enforceGroup3Logic();

function enforceUniqueSubjectsInGroup4() {
  const subjects = ['biology', 'chemistry', 'physics', 'cs'];

  subjects.forEach(subject => {
    const hl = document.querySelector(`input[name="ciencias"][value="${subject}_hl"]`);
    const sl = document.querySelector(`input[name="ciencias"][value="${subject}_sl"]`);

    if (hl && sl) {
      hl.addEventListener('change', () => {
        if (hl.checked && sl.checked) {
          alert(`You cannot select both HL and SL for ${formatSubject(subject)}.`);
          hl.checked = false;
        }
        updateBECList();
        setItinerarioFormativo();
      });

      sl.addEventListener('change', () => {
        if (hl.checked && sl.checked) {
          alert(`You cannot select both HL and SL for ${formatSubject(subject)}.`);
          sl.checked = false;
        }
        updateBECList();
        setItinerarioFormativo();
      });

    }
  });

  function formatSubject(code) {
    const map = {
      biology: "Biology",
      chemistry: "Chemistry",
      physics: "Physics",
      cs: "Computer Science"
    };
    return map[code] || code;
  }
}
enforceUniqueSubjectsInGroup4();

function enforceSingleSelectionGroup5() {
  const checkboxes = document.querySelectorAll('input[name="matematica"]');

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        checkboxes.forEach(other => {
          if (other !== cb) other.checked = false;
        });
      }
      setItinerarioFormativo();
    });
  });
}

enforceSingleSelectionGroup5();

function enforceSingleSelectionGroup6() {
  const checkboxes = document.querySelectorAll('input[name="artes"]');

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        checkboxes.forEach(other => {
          if (other !== cb) other.checked = false;
        });
      }
      setItinerarioFormativo();
    });
  });
}

enforceSingleSelectionGroup6();


document.getElementById('submitBtn').addEventListener('click', function () {
  const name = prompt("Please enter your full name:");
  if (!name) return alert("Name is required.");

  const email = prompt("Please enter your email:");
  if (!email) return alert("Email is required.");

  const selectedSubjects = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  checkboxes.forEach(cb => {
    selectedSubjects.push(cb.value);
  });

  if (selectedSubjects.length === 0) {
    return alert("Please select at least one subject.");
  }

  const data = {
    name: name.trim(),
    email: email.trim(),
    subjects: selectedSubjects
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `ib_subjects_${name.replace(/\s+/g, "_").toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alert("Send the downloaded file to your IB coordinator! \nThank you for your submission!");
});

function updateBECList() {
  const becList = document.getElementById("becList");
  becList.innerHTML = "";

  const selected = (val) =>
    document.querySelector(`input[value="${val}"]`)?.checked;

  const addBEC = (subject) => {
    const li = document.createElement("li");
    li.textContent = subject;
    becList.appendChild(li);
  };

  const removeBEC = (subject) => {
    const items = becList.getElementsByTagName("li");
    for (let i = 0; i < items.length; i++) {
      if (items[i].textContent === subject) {
        becList.removeChild(items[i]);
        break; // Stop after removing the first match
      }
    }
  };

  const historySelected = selected("history_hl") || selected("history_sl");
  const geographySelected = selected("geography_hl") || selected("geography_sl");
  const economicsSelected = selected("economy_hl") || selected("economy_sl");
  const bssSelected = selected("bss_hl") || selected("bss_sl");
  const essSelected = selected("ess_hl") || selected("ess_sl");
  const physicsSelected = selected("physics_hl") || selected("physics_sl");
  const chemistrySelected = selected("chemistry_hl") || selected("chemistry_sl");
  const biologySelected = selected("biology_hl") || selected("biology_sl");

  addBEC("History");
  addBEC("Geography");
  addBEC("Philosophy");
  addBEC("Sociology");
  addBEC("Physics");
  addBEC("Chemistry");
  addBEC("Biology");

  if (bssSelected) {
    removeBEC("History");
    removeBEC("Geography");
  }
  if (historySelected){
    removeBEC("History");
  }
  if (geographySelected){
    removeBEC("Geography");
  }
  if (physicsSelected){
    removeBEC("Physics");
  }
  if (chemistrySelected){
    removeBEC("Chemistry");
  }
  if (biologySelected){
    removeBEC("Biology");
  }
}

function setItinerarioFormativo() {
  const ifElement = document.getElementById("if");
  const selected = (val) => document.querySelector(`input[value="${val}"]`)?.checked;

  const frenchSelected = selected("french_hl") || selected("french_sl");
  const spanishSelected = selected("spanish_hl") || selected("spanish_sl");
  const mathsHLSelected = selected("maths_hl") || selected("math_ai_hl") || selected("math_aa_hl"); // adjust values as needed
  const csSelected = selected("cs_hl") || selected("cs_sl");
  const historySelected = selected("history_hl") || selected("history_sl");
  const geographySelected = selected("geography_hl") || selected("geography_sl");

  const areas = [];

  if (frenchSelected || spanishSelected) {
    areas.push("Linguagens");
  }
  if (mathsHLSelected) {
    areas.push("Matemática");
  }
  if (csSelected) {
    areas.push("Ciências da Natureza");
  }
  if (historySelected && geographySelected) {
    areas.push("Ciências Humanas");
  }

  ifElement.textContent = areas.length > 0 ? areas.join(" / ") : "None";
}

setItinerarioFormativo();