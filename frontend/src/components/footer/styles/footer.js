import styled from 'styled-components';

const Container = styled.div`
        padding: 80px 60px;
        background: #9E9A9A;

        @media (max-width: 1000px) {
            padding: 70px 30px;
        }    
    `;

const Wrapper = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 1000px;
        margin: 0 auto;
    `;

const Column = styled.div`
        display: flex;
        flex-direction: column;
        text-align: left;
        margin-left: 60px;
    `;

const Row = styled.div`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        grid-gap: 20px;

        @media (max-width: 1000px) {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }  
    `;

const Link = styled.a`
        color: #FDF4DC;
        margin-bottom: 20px;
        font-size: 18px;
        text-decoration: none;

        &:hover {
            color: #FF2222;
            transition: 200ms ease-in;
        }
    `;

const Title = styled.p`
        font-size: 24px;
        color: #FDF4DC;
        margin-bottom: 40px;
        font-weight: bold;
    `;

export {
    Container,
    Wrapper,
    Column,
    Row,
    Link, 
    Title,
};