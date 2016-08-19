module.exports = function(req, config={}){
  let defaultLimit = config.limit || 25;
  let defaultSkip = config.skip || 0;

  let limit = req.swagger.params.limit.value || defaultLimit;
  let skip = req.swagger.params.skip.value || defaultSkip;

  let output = '';

  output += `\nLIMIT ${limit}\n`;
  if(skip) output += `SKIP ${skip}\n`;

  return output;
};
