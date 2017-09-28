/**
 * Created by akshay on 28/9/17.
 */

function readFile(event) {

    var input = event.target;
    var reader = new FileReader();

    reader.onload = function () {
        processFile(reader.result)
    };
    reader.readAsText(input.files[0]);

}

function processFile(inpURLS) {
    var list = inpURLS.split("\n");
    var elem = document.getElementById("myBar");
    var url="";
    elem.style.width = '0%';
    elem.innerHTML = '0%';
    document.getElementById("urlsnum").innerText= list.length + " URLs detected.\n\nProcessing :";
    document.getElementById("myProgress").style.display = "";
    var prc = 0.0;
    var pList = new Array();
    for (var i=0; i< list.length; i++){
        if(list[i]!==''){
            url = list[i].trim();
            pList[i] = fetch("http://api.adsafeprotected.com/db2/client/16039/pubm?adsafe_url="+url)
                .then(function (response) {
                return response.json();
            }                                                                                                                                   )
        }

    }

    Promise.all(pList).then(function (vals) {
            var data;
            var completeData ="SNo\tURL\tResponse String\tIAB Category\tLanguage\tClutter\tDrug\tAlcohol\tOffensive\tDownload and Media\tAdult\tSuspicious Activity/Fraud\tHate Speech\tVisible\tTraq\n";
            for(var j=0; j < vals.length; j++ ){
                prc = ((j+1)/vals.length)*100;
                    if (prc >100){
                        prc=100;
                    }
                    elem.style.width = prc + '%';
                    elem.innerHTML = Math.round(prc) + '%';

                data = vals[j];
                completeData+= (j+1).toString() + '\t';
                completeData+= JSON.stringify(data.si)+ '\t';
                completeData+= JSON.stringify(data) + '\t';
                completeData+= JSON.stringify(data.iab) + '\t';
                completeData+= JSON.stringify(data.lang) + '\t';
                completeData+= JSON.stringify(data.clu) + '\t';
                completeData+= JSON.stringify(data.bsc.drg) + '\t';
                completeData+= JSON.stringify(data.bsc.alc) + '\t';
                completeData+= JSON.stringify(data.bsc.off) + '\t';
                completeData+= JSON.stringify(data.bsc.dlm) + '\t';
                completeData+= JSON.stringify(data.bsc.adt) + '\t';
                completeData+= JSON.stringify(data.bsc.sam) + '\t';
                completeData+= JSON.stringify(data.bsc.hat) + '\t';
                completeData+= JSON.stringify(data.vis) + '\t';
                completeData+= JSON.stringify(data.traq) + '\n';
                //completeData+= new Date().toUTCString() + '\n';
                //document.getElementById("output").innerText += completeData;
            }
            //document.getElementById("output").innerText = completeData;
            document.getElementById("output").style.display = "";
            document.getElementById("downloadLink").href = "data:application/octet-stream," + encodeURIComponent(completeData)
        })

    //Download code
    //alert(document.getElementById("output").innerText )
}

