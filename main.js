!function () {
  "use strict";
  const node = document.body;

function processNode(node) {
  if (node.text && node.text.includes("highlight")) {
    return;
  }

  if (node.nodeName === "script") {
    return;
  }

  if (node.children.length === 0) {
    if (node.innerHTML.includes("highlight")) {
      let index = 0;
      const indices = [];
      let timedout = false;
      const timer = setTimeout(() => {
        timedout = true;
        // just in case we accidentally loop.
      }, 5000);

      while (index !== -1 && !timedout) {
        index = node.innerHTML.indexOf("highlight", index);
        if (index !== -1) {
          indices.push(index);
          index += 9;
        }
      }

      // descending order
      indices.sort((a, b) => b - a);
      clearTimeout(timer);
      for (let i = 0; i < indices.length; i++) {
        node.innerHTML =
          node.innerHTML.substring(0, indices[i]) +
          "<mark>highlight</mark>" +
          node.innerHTML.substring(indices[i] + 9);
      }
    }
    return;
  }

  for (let i = 0; i < node.children.length; i++) {
    if (node.children[i]) {
      processNode(node.children[i]);
    }
  }
}

function getInputs() {

  // add inputs here 
  var inputs =  new Tensor(new Float32Array([1.0, 2.0, 3.0, 4.0]), "float32", [2, 2])
  return inputs
}

function run_model() {
   console.log('running_')
   const myOnnxSession = new onnx.InferenceSession();
      // load the ONNX model file
      //
      const model_url = chrome.runtime.getURL('ml/bidaf-9.onnx');

      myOnnxSession.loadModel(model_url).then(() => {
        // generate model input
        const inferenceInputs = getInputs();
        // execute the model
        session.run(inferenceInputs).then(output => {
          // consume the output
          const outputTensor = output.values().next().value;
          console.log(`model output tensor: ${outputTensor.data}.`);
        });
  });
}

function htmlTagsSentenceReader(){
  var list_of_sentences=[];
  var optional_options = {};

  var texttags = ["h1","h2","h3","h4","h5","h6","li","p","span"];

  for (var i = texttags.length - 1; i >= 0; i--) {
    var nodes = document.getElementsByTagName(texttags[i])
    for (var j = nodes.length - 1; j >= 0; j--) {
      if(nodes[j].children.length === 0) {
        var text =nodes[j].textContent;
        var sentences = cldrSegmentation.sentenceSplit(text);
        list_of_sentences = [...list_of_sentences, ...sentences]
      }
    }
  };

  console.log(list_of_sentences);
  return list_of_sentences;
}


function init(){

 var sentences = htmlTagsSentenceReader()
 //takes sentences as input 
 run_model()
 processNode(node);

}

chrome.runtime.onMessage.addListener(function (messageBody, sender, sendResponse) {
  init();
 });

}();
