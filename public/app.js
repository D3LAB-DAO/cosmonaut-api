const codeRunBtn = document.querySelector('#run-code');
const codeFmtBtn = document.querySelector('#format-code');
const login = document.querySelector('#cosm-login')
const logout = document.querySelector('#cosm-logout')
const wasmCode = document.querySelector('#wasm-editor');
const editorWarn = document.querySelector('#wasm-editor-error');

(async function(){
    try {
        const opt = {
            method: 'GET',
            credentials: 'include'
        }
        let res = await fetch('http://127.0.0.1:3334/auth/check', opt)
        res = await res.json()
        const isLogin = res.isLogin
        if (isLogin) {
            login.remove()
        } else {
            logout.remove()
        }
    } catch (error) {}
})();

codeRunBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(btoa(wasmCode.value));
})

codeFmtBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const opt = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Location': "sample location"
        },
        body: JSON.stringify({
            files: {
                file1: btoa(wasmCode.value)
            }
        }),
    }
    try {
        let res = await fetch('http://127.0.0.1:3334/rust/fmt', opt);
        const data = await res.json();
        console.log(data)
        if (res.redirected) {
            window.location.replace(data.url)
        } else {
            wasmCode.value = atob(data.result.file1);

        }



    } catch (err) {
        console.log(err)
        // editorWarn.innerText = atob(res.result);
    }
})
