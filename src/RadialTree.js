import React from 'react';
import { Group } from '@vx/group';
import { Tree } from '@vx/hierarchy';
import { LinkRadial } from '@vx/shape';
import { LinearGradient } from '@vx/gradient';
import { hierarchy } from 'd3-hierarchy';
import { pointRadial } from 'd3-shape';
import NodeGroup from 'react-move/NodeGroup';


function findCollapsedParent(node) {
  if (!node.data.isExpanded) {
    return node;
  } else if (node.parent) {
    return findCollapsedParent(node.parent);
  } else {
    return null;
  }
}

function radialPoint(angle, radius) {
  const [x,y] = pointRadial(angle, radius);
  return {x, y};
}

export default class extends React.Component {
  render() {
    const {
      data,
      width,
      height,
      events = false,
      margin = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
    } = this.props;

    if (width < 10) return null;

    return (
      <svg width={width} height={height}>
        <LinearGradient id="lg" from="#fd9b93" to="#fe6e9e" />
        <rect width={width} height={height} rx={14} fill="#272b4d" />
        <Tree
          top={margin.top}
          left={margin.left}
          root={hierarchy(data, d => (d.isExpanded ? d.children : null))}
          size={[ Math.PI, 250 ]}
          separation={(a, b) => (a.parent === b.parent ? 1 : 2) / a.depth}
        >
          {({ links, descendants }) => (
            <Group top={width / 2} left={height / 2}>

              <NodeGroup
                data={links}
                keyAccessor={(d, i) =>
                  `${d.source.data.name}_${d.target.data.name}`}
                start={({ source, target }) => {
                  return {
                    source: {
                      x: source.data.x0,
                      y: source.data.y0
                    },
                    target: {
                      x: source.data.x0,
                      y: source.data.y0
                    }
                  };
                }}
                enter={({ source, target }) => {
                  return {
                    source: {
                      x: [source.x],
                      y: [source.y]
                    },
                    target: {
                      x: [target.x],
                      y: [target.y]
                    }
                  };
                }}
                update={({ source, target }) => {
                  return {
                    source: {
                      x: [source.x],
                      y: [source.y]
                    },
                    target: {
                      x: [target.x],
                      y: [target.y]
                    }
                  };
                }}
                leave={({ source, target }) => {
                  const collapsedParent = findCollapsedParent(source);
                  return {
                    source: {
                      x: [collapsedParent.data.x0],
                      y: [collapsedParent.data.y0]
                    },
                    target: {
                      x: [collapsedParent.data.x0],
                      y: [collapsedParent.data.y0]
                    }
                  };
                }}
              >
                {nodes => (
                  <Group>
                    {nodes.map(({ key, data, state }) => {
                      return (
                        <LinkRadial
                          data={state}
                          stroke="#374469"
                          strokeWidth="1"
                          fill="none"
                          key={key}
                        />
                      );
                    })}
                  </Group>
                )}
              </NodeGroup>

              <NodeGroup
                data={descendants}
                keyAccessor={d => d.data.name}
                start={({ parent }) => {
                  const radialParent = radialPoint(parent ? parent.x : 0 , parent ? parent.y : 0);
                  return {
                    x: radialParent.x,
                    y: radialParent.y,
                    opacity: 0
                  };
                }}
                enter={({ x, y }) => {
                  const point = radialPoint(x, y);
                  return {
                    x: [point.x],
                    y: [point.y],
                    opacity: [1]
                  };
                }}
                update={({ x, y }) => {
                  const point = radialPoint(x, y);
                  return {
                    x: [point.x],
                    y: [point.y],
                    opacity: [1]
                  };
                }}
                leave={({ parent }) => {
                  const collapsedParent = findCollapsedParent(parent);
                  const radialParent = radialPoint(collapsedParent.data.x0, collapsedParent.data.y0);
                  return {
                    x: [radialParent.x],
                    y: [radialParent.y],
                    opacity: [0]
                  };
                }}
              >
                {nodes => (
                  <Group>
                    {nodes.map(({ key, data: node, state }) => {
                      const width = 40;
                      const height = 20;
                      return (
                        <Group
                          top={state.y}
                          left={state.x}
                          key={key}
                          opacity={state.opacity}
                        >
                          {node.depth === 0 && (
                            <circle
                              r={12}
                              fill="url('#lg')"
                              onClick={() => {
                                //console.log('node.onClick', node);
                                if (!node.data.isExpanded) {
                                  node.data.x0 = node.x;
                                  node.data.y0 = node.y;
                                }
                                node.data.isExpanded = !node.data.isExpanded;
                                this.forceUpdate();
                              }}
                            />
                          )}
                          {node.depth !== 0 && (
                            <rect
                              height={height}
                              width={width}
                              y={-height / 2}
                              x={-width / 2}
                              fill={'#272b4d'}
                              stroke={
                                node.data.children ? '#03c0dc' : '#26deb0'
                              }
                              strokeWidth={1}
                              strokeDasharray={
                                !node.data.children ? '2,2' : '0'
                              }
                              strokeOpacity={!node.data.children ? 0.6 : 1}
                              rx={!node.data.children ? 10 : 0}
                              onClick={() => {
                                //console.log('node.onClick', node);
                                if (!node.data.isExpanded) {
                                  node.data.x0 = node.x;
                                  node.data.y0 = node.y;
                                }
                                node.data.isExpanded = !node.data.isExpanded;
                                this.forceUpdate();
                              }}
                            />
                          )}
                          <text
                            dy={'.33em'}
                            fontSize={9}
                            fontFamily="Arial"
                            textAnchor={'middle'}
                            style={{ pointerEvents: 'none' }}
                            fill={
                              node.depth === 0 ? (
                                '#71248e'
                              ) : node.children ? (
                                'white'
                              ) : (
                                '#26deb0'
                              )
                            }
                          >
                            {node.data.name}
                          </text>
                        </Group>
                      );
                    })}
                  </Group>
                )}
              </NodeGroup>
            </Group>
          )}
        </Tree>
      </svg>
    );
  }
}
