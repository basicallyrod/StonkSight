import styled from 'styled-components';

const Container = styled.div`
        padding: 80px 60px;
         @media (max-width: 1000px) {
            padding: 70px 30px;
        }    
    `;

const Wrapper = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: center;
        max-width: 1000px;
        margin: 0 auto;
    `;

const Section = styled.div`
        display: grid;
        text-align: left;
        /* margin-left: 60px; */
        gap: 2em;
    `;

const Item = styled.div`
    width: 10px;
    height: 10px;
    background: #000;
    margin-left: 1em;
    margin-right: 1em;
`;

const Link = styled.a`
        color: #fff;
        margin-bottom: 20px;
        font-size: 18px;
        text-decoration: none;

        &:hover {
            color: #ff9c00;
            transition: 200ms ease-in;
        }
    `;

const Title = styled.p`
        fonst-size: 24px;
        color: #fff;
        margin-bottom: 40px;
        font-weight: bold;
    `;

export {
    Container,
    Wrapper,
    Section,
    Item,
    Link, 
    Title,
};