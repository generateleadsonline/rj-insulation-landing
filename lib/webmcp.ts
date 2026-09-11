type CalculatorTool = {name:string;title:string;description:string;inputSchema:object;execute:(input:unknown)=>unknown};
export function registerCalculatorTool(tool:CalculatorTool) {
  const context=(document as Document & {modelContext?:{registerTool:(tool:CalculatorTool & {annotations:object},options:{signal:AbortSignal})=>unknown}}).modelContext;
  if(!context?.registerTool)return ()=>{};
  const lifecycle=new AbortController();
  try{void Promise.resolve(context.registerTool({...tool,annotations:{readOnlyHint:false,untrustedContentHint:false}},{signal:lifecycle.signal})).catch(()=>{})}catch{}
  return ()=>lifecycle.abort();
}
