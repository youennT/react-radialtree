import React from 'react';
import { render } from 'react-dom';
import RadialTree from './RadialTree';
import data from './data';

// import { hierarchy } from 'd3-hierarchy';
// import searchTree from './search';
// const root = hierarchy(data);
// console.log('searchTree', searchTree(root, d => d.data.name === 'C1', []));


const App = () => (
  <RadialTree data={data} width={600} height={600} />
);

render(<App />, document.getElementById('root'));
