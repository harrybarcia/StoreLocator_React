import React, { useEffect, useState } from "react";

const ColorPicker = (props) => {
    console.log(props)
    const classes = {
        base: "flex flex-col bg-gray-800 p-5 rounded-xl",
        color: "w-12 absolute h-12 rounded-xl",
        backdrop: "w-12 blur-md opacity-50 h-12 rounded-xl",
        button:"text-gray-400 mt-4 text-sm w-full border py-2 rounded-xl hover:bg-white transition-colors hover:border-black hover:text-gray-700"
    };
    const [value, setValue] = useState("#000000")
    const [color, setColor] = useState(value);
    const pickerId = `color-picker_${Date.now()}`;
    useEffect(() => {
        setColor(value)
    }, [value])
    useEffect(() => {
        props.sendColorFromModal(color)
    }, [color])
    

    const handleChangeColor = ((e) =>{
        setColor(e.target.value)
    })

    return (
        <section className={classes.base}>
            <input
                onChange={handleChangeColor}
                type="color"
                className="h-0 w-0 opacity-0"
                id={pickerId}
            />
            <section className="relative">
                <label htmlFor={pickerId}>
                    <div style={{ backgroundColor: color }} className={classes.color}></div>
                    <div style={{ backgroundColor: color }} className={classes.backdrop}></div>
                </label>
            </section>
            <button className={classes.button}>{color}</button>
        </section>
    );
};

export default ColorPicker;
