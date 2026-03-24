import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../lib/AuthContext"; // FIXED PATH

export default function PawTraksPage() {
  const { user } = useAuth();
  const iframeRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;

    const userEmail = user.email;
    const userName = user.full_name || "User";

    const users = JSON.parse(localStorage.getItem("pt_users") || "{}");

    if (!users[userEmail]) {
      users[userEmail] = {
        name: userName,
        email: userEmail,
        dogs: [],
        createdAt: new Date().toISOString()
      };
    } else {
      users[userEmail].name = userName;
    }

    localStorage.setItem("pt_users", JSON.stringify(users));
    localStorage.setItem(
      "pt_session",
      JSON.stringify({
        email: userEmail,
        loginAt: new Date().toISOString()
      })
    );

    setReady(true);
  }, [user]);

  const srcUrl =
    "https://media.base44.com/files/public/user_69af6739fc445603f6ba4418/6087f3798_eslint-disableupdated.txt";

  const htmlDoc = useMemo(() => {
    if (!ready) return "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PawTraks</title>
<style>
  body { margin:0; background:#0c0e16; color:#f4a24d; font-family:sans-serif; }
</style>
</head>
<body>
<div id="root">Loading PawTraks...</div>

<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<script>
fetch("${srcUrl}")
  .then(r => r.text())
  .then(code => {
    code = code.replace(/\/\*\s*eslint-disable\s*\*\//g, "");
    code = code.replace(/import\s*\{([^}]+)\}\s*from\s*['"]react['"];?/g, "var {$1} = React;");
    code = code.replace(/export\s+default\s+function\s+PawTraks/, "function PawTraks");

    code += "\nconst root = ReactDOM.createRoot(document.getElementById('root')); root.render(React.createElement(PawTraks));";

    const result = Babel.transform(code, { presets: ["react"] });

    const script = document.createElement("script");
    script.textContent = result.code;
    document.body.appendChild(script);
  })
  .catch(err => {
    document.getElementById("root").innerHTML = "Error loading app";
    console.error(err);
  });
</script>
</body>
</html>`;
  }, [ready]);

  if (!ready) {
    return <div style={{ color: "#f4a24d" }}>Preparing PawTraks...</div>;
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={htmlDoc}
      style={{ width: "100%", height: "100vh", border: "none" }}
      title="PawTraks"
    />
  );
}
