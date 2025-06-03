document.getElementById('submitBtn').addEventListener('click', function() {
  const selectedOptions = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  checkboxes.forEach(function(checkbox) {
    selectedOptions.push(checkbox.value);
  });

  if (selectedOptions.length > 0) {
    const csvContent = "data:text/csv;charset=utf-8,Itinerário Formativo,Disciplina\n";
    selectedOptions.forEach(function(option) {
      csvContent += `"Linguagens e suas Tecnologias","${option}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selecao_itinerarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  } else {
    alert('Por favor, selecione ao menos uma disciplina.');
  }
});
