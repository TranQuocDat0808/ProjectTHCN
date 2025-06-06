import React from 'react';
import Slider from '../components/Slider';
import Search from '../components/Search';


const Home = () => {
    return (
        <div className="books" style={{flex: "1 1 auto",marginLeft:"15px"}}>
            <Slider/>
            <Search/>     
        </div>
    );
};

export default Home;
