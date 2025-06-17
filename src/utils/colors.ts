export const periodColors = {
  pre: '#4C78A8',    
  covid: '#F58518', 
  post: '#54A24B'    
};

export const periodLabels = {
  pre: 'Pre-COVID (2019-01 a 2020-02)',
  covid: 'Durante COVID (2020-03 a 2021-06)',
  post: 'Post-COVID (2021-07 a 2022-12)'
};

export const periodRanges: Record<string, [string, string]> = {
  pre: ['2019-01', '2020-02'],
  covid: ['2020-03', '2021-06'],
  post: ['2021-07', '2022-12']
};
