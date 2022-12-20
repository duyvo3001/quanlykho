import jsPDF from "jsPDF";
import html2canvas from "html2canvas";
import axios from 'axios';
console.log('hello')
function click1() {

  window.onload = function () {

    let button = document.getElementById('btnPrint')
    button.addEventListener('click', (e) => {
      if (document.readyState === "complete") {

        const myPromise = new Promise((resolve, reject) => {
          resolve(
            buttonClick()
          );
          reject(function (error) { console.error(error) })
        });

        myPromise
          .then(
            axios.post('/exportfile')
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              })
              .finally(
                setTimeout(function () {
                  window.location = "http://localhost:8000/exportPage";
                }, 3000)
              )
          )
      }
    })

    function buttonClick() {
      const doc = new jsPDF();
      var elementHTML = document.querySelector("#convert_to_print");
      doc.html(elementHTML, {
        callback: function (doc) {
          doc.save('file_xuat_hang.pdf');
        },
        margin: [10, 10, 10, 10],
        autoPaging: 'text',
        x: 0,
        y: 0,
        width: 190,
        windowWidth: 675
      })
    }

  };
}
export default {click1}