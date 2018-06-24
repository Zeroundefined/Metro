import * as React from 'react';
import './Card.scss';

interface Props {
  title: string;
  className: string;
  style?: any；
}

export class Card extends React.Component<Props> {
  render() {
    const { title, children, className, style } = this.props;
    return <div className={`card ${className}`} style={{display: 'flex'; flexDirection: 'column'; flexWrap: 'wrap', ...style}}>
      <div className="card-title"style={{fontSize: '20px';borderBottom: '1px solid #eee';paddingBottom: '15px'; marginBottom: '15px';}}>{title}</div>
      <div className="card-content" style={{display: 'flex'; flexWrap: 'wrap';}}>
        {children}
      </div>
    </div>
  }
} 