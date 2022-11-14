import { StyledTable, THead, TBody, TFoot, Caption, Colgroup, Col, Col33, Col66, TH, TR, TD } from './styles/table';

const Table = ({ children, ...restProps }) => {
  return <StyledTable {...restProps}>{children}</StyledTable>;
};

Table.THead = ({ children, ...restProps }) => {
  return <THead {...restProps}>{children}</THead>;
};

Table.TBody = ({ children, ...restProps }) => {
  return <TBody {...restProps}>{children}</TBody>;
};

Table.TFoot = ({ children, ...restProps }) => {
  return <TFoot {...restProps}>{children}</TFoot>;
};

Table.TH = ({ children, ...restProps }) => {
  return <TH {...restProps}>{children}</TH>;
};

Table.TR = ({ children, ...restProps }) => {
  return <TR {...restProps}>{children}</TR>;
};

Table.TD = ({ children, ...restProps }) => {
  return <TD {...restProps}>{children}</TD>;
};

Table.Caption = ({ children, ...restProps }) => {
  return <Caption {...restProps}>{children}</Caption>;
};

Table.Colgroup = ({ children, ...restProps }) => {
  return <Colgroup {...restProps}>{children}</Colgroup>;
};

Table.Col = ({ children, ...restProps }) => {
  return <Col {...restProps}>{children}</Col>;
};

Table.Col33 = ({ children, ...restProps }) => {
  return <Col33 {...restProps}>{children}</Col33>;
};

Table.Col66 = ({ children, ...restProps }) => {
  return <Col66 {...restProps}>{children}</Col66>;
};


export {
    Table
};