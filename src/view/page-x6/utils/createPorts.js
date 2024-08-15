export default function () {
  return {
    groups: {
      groupTop: {
        position: 'top',
        attrs: {
          // circle: {
          //   magnet: true,
          //   stroke: '#8f8f8f',
          //   r: 5,
          // },
        },
      },
      groupRight: {
        position: 'right',
        attrs: {
          // circle: {
          //   magnet: true,
          //   stroke: '#8f8f8f',
          //   r: 5,
          // },
        },
      },
      groupBottom: {
        position: 'bottom',
        attrs: {
          // circle: {
          //   magnet: true,
          //   stroke: '#8f8f8f',
          //   r: 5,
          // },
        },
      },
      groupLeft: {
        position: 'left',
        // attrs: {
        //   circle: {
        //     magnet: true,
        //     stroke: '#8f8f8f',
        //     r: 5,
        //   },
        // },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'groupTop',
      },
      {
        id: 'port2',
        group: 'groupRight',
      },
      {
        id: 'port3',
        group: 'groupBottom',
      },
      {
        id: 'port4',
        group: 'groupLeft',
      },
    ],
  };
}