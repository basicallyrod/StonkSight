import React from 'react';
// import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { Routes, Route, BrowserRouter} from "react-router-dom"
import {ToastContainer} from 'react-toastify'
import {ModalProvider} from 'styled-react-modal'
import 'react-toastify/dist/ReactToastify.css'
// import { GlobalStyles } from "./global-styles";
import { HeaderContainer } from './containers/header'
import { BodyContainer } from './containers/body';
// import { HeaderContainer } from './containers/header';
// import { BodyContainer } from "./containers/Body";
import { FooterContainer } from "./containers/footer";
import { LoginContainer } from "./containers/loginwithcomponents";
import { RegisterContainer } from "./containers/registerwithcomponents";
import { WatchlistContainer} from "./containers/watchlist";
import { ProfileContainer} from "./containers/profile";
import { HeatmapContainer} from "./containers/heatmap";
import { CandlestickChartContainer} from "./containers/candlestickchart"
import { LineChartContainer} from "./containers/linechart"
// import { FooterContainer } from './containers/footer'
import * as d3 from "d3"

function App() {
  return (
    // <>      
      <BrowserRouter>
      
          <HeaderContainer/>
          
          <Routes>
            {/* <div className="App"> */}
              <Route path='/' element = {<BodyContainer/>}/>
              <Route path='/login' element = {<LoginContainer/>}/>
              <Route path = '/register' element = {<RegisterContainer/>}/>
              <Route path = '/watchlist' element = {<WatchlistContainer/>}/>
              <Route path = '/candlestickchart' element = {<CandlestickChartContainer/>}/>
              <Route path = '/linechart' element = {<LineChartContainer/>}/>
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
