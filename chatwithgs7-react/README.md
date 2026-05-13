# React + Vite

This application is a lightweight demo showcasing a client-side chat experience with GS7.  
It is intended for exploration, learning, and demonstration purposes, rather than as a production-deployed service.

## Security note

One moderate security advisory remains for Vite (GHSA-4w7w-66w2-5vf9).

This advisory affects only the local Vite development server, specifically the handling of source map (`.map`) files during dependency optimization. It does **not** impact the built application or any production runtime environment.

This project is a purely client-side demo and does not expose Vite development tooling, local servers, or filesystem access to untrusted users.

Resolving this advisory would require upgrading to Vite 8, which introduces breaking changes that are not justified given the scope and risk profile of this demo.

**Risk has been reviewed and explicitly accepted.**
``
