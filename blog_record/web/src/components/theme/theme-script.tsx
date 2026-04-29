export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;if(t==='light'||t==='dark'){d.dataset.theme=t}else{d.removeAttribute('data-theme')}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

