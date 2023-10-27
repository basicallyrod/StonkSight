import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter} from "react-router-dom"
import {ToastContainer} from 'react-toastify'
import {ModalProvider} from 'styled-react-modal'
import 'react-toastify/dist/ReactToastify.css'
import { HeaderContainer } from './containers/header'
// import { HeaderContainer } from './containers/header';
// import { BodyContainer } from "./containers/Body";
import { FooterContainer } from "./containers/footer";
import { LoginContainer } from "./containers/loginwithcomponents";
import { RegisterContainer } from "./containers/registerwithcomponents";
import { WatchlistContainer} from "./containers/watchlist";

function App() {
  return (
    // <>      
      <BrowserRouter>
      
          <HeaderContainer/>
          
          <Routes>
            {/* <div className="App"> */}
              <Route path='/' element = {<LoginContainer/>}/>
              <Route path='/login' element = {<LoginContainer/>}/>
              <Route path = '/register' element = {<RegisterContainer/>}/>
              <Route path = '/watchlist' element = {<WatchlistContainer/>}/>
              {/* <Route path = '/candlestickchart' element = {<CandlestickChartContainer/>}/> */}
              {/* <Route path = '/linechart' element = {<LineChartContainer/>}/> */}
              {/* <Route path = '/profile' element = {<ProfileContainer/>}/> */}
              {/* <Route path = '/heatmap' element = {<HeatmapContainer/>}/> */}
              
            {/* </div> */}
          </Routes>
          {/* <ModalProvider></ModalProvider> */}
          <FooterContainer/>
          <ToastContainer/>
          
          
      </BrowserRouter>
      
    // </>


  );
}

export default App;
