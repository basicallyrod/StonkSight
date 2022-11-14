import styled from 'styled-components';

const StyledTable = styled.table`
    border: 1px solid black;
    display: fixed;
`;

const THead = styled.thead`
    border: 1px solid black;
 // custom css goes here
`;

const TFoot = styled.tfoot`
  // custom css goes here
    border: 1px solid black;
`;

const TBody = styled.tbody`
    border: 1px solid black;
    display: flex;
    flex-direction: column;
`;

const Caption = styled.caption`
    border: 1px solid black;
`;

const Colgroup = styled.colgroup`
    border: 1px solid black;
`;

const Col = styled.col`

`;

const Col33 = styled.col`
    width: 33%;
`;

const Col66 = styled.col`
    width: 66%;
`;

const TR = styled.tr`
    // custom css goes here
    border: 1px solid black;
`;

const TH = styled.th`
    // custom css goes here
    border: 1px solid black;
    width: 100%;
`;

const TD = styled.td`
    // custom css goes here
    border: 1px solid black;
    width: 100%;
`;

export {
    StyledTable,
    THead,
    TFoot,
    TBody,
    Caption,
    Colgroup,
    Col,
    Col33,
    Col66,
    TR,
    TH,
    TD
};