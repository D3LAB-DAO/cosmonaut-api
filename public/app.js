const codeRunBtn = document.querySelector('#run-code')
const codeFmtBtn = document.querySelector('#format-code')
const wasmCode = document.querySelector('#wasm-editor')

codeFmtBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(btoa(wasmCode.value));
})

codeRunBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: btoa(wasmCode.value),
    }
    let res = await fetch('http://127.0.0.1:3000/fmt', opt);
    let afterFmtB64 = await res.text()
    wasmCode.value = atob(afterFmtB64);
})
