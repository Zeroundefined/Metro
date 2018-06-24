import * as React from 'react';
import './Card.scss';

interface Props {
  title: string;
  className: string;
}

export class Card extends React.Component<Props> {
  render() {
    const { title, children, className } = this.props;
    return <div className={`card ${className}`}>
      <div className="card-title">{title}</div>
      <div className="card-content">
        {children}
      </div>
    </div>
  }
}