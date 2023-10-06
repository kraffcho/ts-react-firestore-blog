import React from "react";

interface Props {
  decreaseHeight: () => void;
  increaseHeight: () => void;
}

const HeightAdjuster: React.FC<Props> = ({
  decreaseHeight,
  increaseHeight,
}) => {
  return (
    <div className="increase-height">
      <button type="button" onClick={decreaseHeight} className="btn yellow">
        -
      </button>
      <button type="button" onClick={increaseHeight} className="btn yellow">
        +
      </button>
    </div>
  );
};

export default HeightAdjuster;
