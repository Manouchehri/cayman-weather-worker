#### Windows Users
```powershell
Set-ExecutionPolicy Unrestricted
```

## System Setup
```sh
npm install -g wrangler 
wrangler --version 
```

## Project Setup
```sh
git clone https://github.com/Manouchehri/cayman-weather-worker.git -b solution-1
cd cayman-weather-worker/
npm install
wrangler dev
```

Then go to `http://localhost:61023/docs/` in your browser. Note the trailing slash!
