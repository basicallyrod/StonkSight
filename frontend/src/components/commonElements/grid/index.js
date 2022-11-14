import React from "react";

import { Container, Wrapper, Section, Item, Link, Title } from './styles/grid';

const Grid = ({ children, ...restProps }) => {
    return < Container {...restProps}> {children}</Container>;
};

Grid.Wrapper = ({children, ...restProps}) => {
    return <Wrapper {...restProps}>{children}</Wrapper>;
};

Grid.Section = ({ children, ...restProps}) => {
    return <Section {...restProps}>{children}</Section>;
};

Grid.Item = ({ children, ...restProps}) => {
    return <Item {...restProps}>{children}</Item>;
};



Section.Link = ({ children, ...restProps }) => {
    return <Link {...restProps}> {children} </Link>;
};

Grid.Title = ({ children, ...restProps}) => {
    return <Title {...restProps}>{children}</Title>;
};

export default Grid
// import React from "react"
// import {Routes, Route, Link} from "react-router-dom";
// import ImageGrid from "../ImageGrid";

// const Grid = () => {
//     return(
//         <div className = "Grid">
//             {/* <nav>
//                 <Link to = "Grid">Grid Page</Link>
//             </nav> */}
//             {/* <p>
//                 Grid Goes Here
//             </p> */}

//             {/* <Routes>
//                 <Route path = "Grid" element={<ImageGrid/>}/>
//             </Routes> */}
//         </div>
//     )
// }

// export default Grid