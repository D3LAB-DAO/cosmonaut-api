const codeRunBtn = document.querySelector('#run-code');
const codeFmtBtn = document.querySelector('#format-code');
const wasmCode = document.querySelector('#wasm-editor');
const editorWarn = document.querySelector('#wasm-editor-error');

codeRunBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(btoa(wasmCode.value));
})

codeFmtBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: btoa(wasmCode.value),
    }
    let res = await fetch('http://127.0.0.1:3000/fmt', opt);
    res = await res.json();
    if (res.code === "success") {
        wasmCode.value = atob(res.result);
    } else if (res.code === "fail") {
        let bufToErr = atob(res.result);
        editorWarn.innerText = bufToErr;
    }
})
