var currentTab = 0;

/**
 * @param {string | number} n
 */
function fixStepIndicator(n) {
  const x = document.getElementsByClassName("step");
  for (let i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}

/**
 * @param {number} n
 */
function showTab(n) {
  const x = document.getElementsByClassName("tab");
  // @ts-ignore
  x[n].style.display = "block";
  // The following ignores are just for single-line element changes that may be undefined.
  // Except the elements here will be defined, so it isn't a problem.
  if (n === 0) {
    // @ts-ignore
    document.getElementById("backBtn").style.display = "none";
  } else {
    // @ts-ignore
    document.getElementById("backBtn").style.display = "inline";
    // @ts-ignore
    document.getElementById("predictionError").style.display = "none";
  }
  if (n === (x.length - 1)) {
    // @ts-ignore
    document.getElementById("nextBtn").style.display = "none";
    // @ts-ignore
    document.getElementById("predictionError").style.display = "none";
  } else {
    // @ts-ignore
    document.getElementById("nextBtn").style.display = "inline";
    // @ts-ignore
    document.getElementById("nextBtn").innerHTML = "Next";
    // @ts-ignore
    document.getElementById("predictionError").style.display = "none";
  }
  fixStepIndicator(n);
}

showTab(currentTab);

function validateForm() {
  var valid = true;
  const x = document.getElementsByClassName("tab");
  const y = x[currentTab].getElementsByTagName("input");
  for (let i = 0; i < y.length; i++) {
    if (y[i].value === "") {
      y[i].className += " invalid";
      valid = false;
    }
  }
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid;
}


/**
 * @param {number} n
 */
// eslint-disable-next-line consistent-return, no-unused-vars
function nextPrev(n) {
  var x = document.getElementsByClassName("tab");
  if (n === 1 && !validateForm()) return false;
  // @ts-ignore
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;
  if (currentTab >= x.length) {
    return false;
  }
  showTab(currentTab);
}
