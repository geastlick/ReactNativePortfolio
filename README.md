# ReactNativePortfolio
Includes json-server and ReactPortfolio from React class with the addition of a React Native mobile app

- First start json-server.  Both the Web app and the Mobile app rely on data.
```
cd json-server
./run.sh
```
  - run.sh is just a convenience script that executes `json-server --watch db.json -p 3006 --routes routes.json`

- If desired, start the Web application.
```
cd web
npm start
```

- If desired, start the Mobile application
```
cd mobile
expo start
```
