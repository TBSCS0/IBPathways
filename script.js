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
    });
  });
}

// Call the function
enforceGroup3Logic();

function enforceUniqueSubjectsInGroup4() {
  const group4Subjects = ['biologia', 'quimica', 'fisica', 'computacao'];

  group4Subjects.forEach(subject => {
    const options = document.querySelectorAll(`input[name="ciencias"][value="${subject}"]`);

    options.forEach(cb => {
      cb.addEventListener("change", () => {
        if (cb.checked) {
          options.forEach(other => {
            if (other !== cb && other.checked) {
              alert(`You cannot select both HL and SL for ${subject === 'computacao' ? 'Computer Science' : capitalize(subject)}.`);
              cb.checked = false;
            }
          });
        }
      });
    });
  });

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

