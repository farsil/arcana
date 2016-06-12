function onSpectrumChange() 
{
    text = document.getElementById('spectrum-change');
    text.value = this.value;
}

function onNaturalChange() 
{
    text = document.getElementById('natural-change');
    text.value = this.value;
}

function onSpectrumInput() 
{
    text = document.getElementById('spectrum-input');
    text.value = this.value;
}

function onNaturalInput() 
{
    text = document.getElementById('natural-input');
    text.value = this.value;
}

function resetSpectrum()
{
    range = document.getElementById('spectrum-range');
    change = document.getElementById('spectrum-change');
    input = document.getElementById('spectrum-input');

    range.value = 50;
    change.value = range.value;
    input.value = range.value;
}

function resetNatural()
{
    range = document.getElementById('natural-range');
    change = document.getElementById('natural-change');
    input = document.getElementById('natural-input');

    range.value = 50;
    change.value = range.value;
    input.value = range.value;
}

Spectrum.attach("spectrum", "#spectrum-range");

range = document.getElementById('spectrum-range');
reset = document.getElementById('spectrum-reset');

range.addEventListener("change", onSpectrumChange);
range.addEventListener("input", onSpectrumInput);
reset.addEventListener("click", resetSpectrum);

resetSpectrum();

range = document.getElementById('natural-range');
reset = document.getElementById('natural-reset');

range.addEventListener("change", onNaturalChange);
range.addEventListener("input", onNaturalInput);
reset.addEventListener("click", resetNatural);

resetNatural();
