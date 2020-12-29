import React from "react";

export const SimpleRouter = ({ phase, children }) => {
  const child = React.Children.toArray(children).filter((c) => {
    return c.props.route === phase;
  });

  return child;
};
