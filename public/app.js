const codeRunBtn = document.querySelector('#run-code');
const codeFmtBtn = document.querySelector('#format-code');
const googleBtn = document.querySelector('.google-btn');
const wasmCode = document.querySelector('#wasm-editor');
const editorWarn = document.querySelector('#wasm-editor-error');


googleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("I am google login");
})

codeRunBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(btoa(wasmCode.value));
})

codeFmtBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            file1: btoa(wasmCode.value)
        }),
    }
    let res = await fetch('http://127.0.0.1:3000/rust/fmt', opt);
    res = await res.json();
    if (res.code === "success") {
        wasmCode.value = atob(res.result.file1);
    } else if (res.code === "fail") {
        editorWarn.innerText = atob(res.result);
    }
})
