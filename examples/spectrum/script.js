function onSpectrumChange() 
{
    text = document.getElementById('spectrum-change');
    text.value = this.value;
}

function onNativeChange() 
{
    text = document.getElementById('native-change');
    text.value = this.value;
}

function onSpectrumInput() 
{
    text = document.getElementById('spectrum-input');
    text.value = this.value;
}

function onNativeInput() 
{
    text = document.getElementById('native-input');
    text.value = this.value;
}

function resetSpectrum()
{
    range = document.getElementById('spectrum-demo1');
    change = document.getElementById('spectrum-change');
    input = document.getElementById('spectrum-input');

    range.value = 50;
    change.value = range.value;
    input.value = range.value;
}

function resetNative()
{
    range = document.getElementById('native-range');
    change = document.getElementById('native-change');
    input = document.getElementById('native-input');

    range.value = 50;
    change.value = range.value;
    input.value = range.value;
}

Spectrum.attach("spectrum", "#spectrum-demo1, #spectrum-demo2");

range = document.getElementById('spectrum-demo1');
reset = document.getElementById('spectrum-reset');

range.addEventListener("change", onSpectrumChange);
range.addEventListener("input", onSpectrumInput);
reset.addEventListener("click", resetSpectrum);

resetSpectrum();

range = document.getElementById('native-range');
reset = document.getElementById('native-reset');

range.addEventListener("change", onNativeChange);
range.addEventListener("input", onNativeInput);
reset.addEventListener("click", resetNative);

resetNative();
