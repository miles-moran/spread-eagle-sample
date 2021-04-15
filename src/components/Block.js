import React from "react";

export default ({ backgroundColor = "#F0F8FF", header, subheader, slant}) => {
    header = 'test'
    subheader='test'
    slant='test'
  return (
    <section class='block-container'>
        <div class='block-content'>
            <div class='block-header'>{header}</div>
            <div class='block-text'>{subheader}</div>
        </div>
    </section>
  );
};
