(function() {
  const inputsContainer = document.getElementById('inputs')
  const resultContainer = document.getElementById('result')

  selectHP = document.getElementById('hp')
  selectInvoiceType = document.getElementById('invoice-type')

  let getFile = function (event) {
    inputsContainer.innerHTML = 'Loading...'
    resultContainer.innerHTML = 'Loading...'

    csvFilePath = '../data/' + selectInvoiceType.value + ' ' + selectHP.value + '.csv'
    fetchFile(csvFilePath)
  }

  let fetchFile = function (csvFilePath) {
    fetch(csvFilePath)
     .then(response => response.text())
     .then(data => {
       csv({
        noheader: true,
        output: "csv"
       })
       .fromString(data)
       .then(function(rows){
         let questionLabels = []
         let questionValues = [[], []]

         inputsContainer.innerHTML = ''
         resultContainer.innerHTML = ''

         // Load options
         rows.forEach((columns, i) => {
            columns.forEach((cell, j) => {
              // Get labels
              if (i===0 && j===0) {
                questionLabels = cell.split('/')
              } else if (i===0) {
                questionValues[1].push(cell)
              } else if (j===0) {
                questionValues[0].push(cell)
              }
            })

         })

         questionLabels.forEach((item, i) => {
           const label = document.createElement('label')
           const select = document.createElement('select')
           const name = i==0 ? "Y" : "X"

           label.innerHTML = questionLabels[i]
           label.setAttribute('for', name)
           inputsContainer.append(label)

           select.name = name
           select.id = name
           select.addEventListener('change', getResult)
           questionValues[i].forEach((item, j) => {
             const option = document.createElement('option')
             option.value = [j+1]
             option.text = questionValues[i][j]
             if (option.text) {
               select.add(option)
             }
           })
           inputsContainer.append(select)
         })

         getResult()
       })
     })

    let getResult = function (event) {
      getCell(document.getElementById('X').value, document.getElementById('Y').value)
    }

    let getCell = function (x, y) {
      fetch(csvFilePath)
       .then(response => response.text())
       .then(data => {
         csv({
          noheader: true,
          output: "csv"
         })
         .fromString(data)
         .then(function(rows){
           rows.forEach((columns, i) => {
              columns.forEach((cell, j) => {
                if (i==y && j==x) {
                  resultContainer.innerHTML = cell
                }
              })
            })
         })
       })
    }
  }

  selectHP.addEventListener('change', getFile)
  selectInvoiceType.addEventListener('change', getFile)
  getFile()

})();
