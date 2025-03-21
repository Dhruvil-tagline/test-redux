import './ComponentCss/input.css'
function InputCom({ name, id, value, onChange, type, placeholder}) {
  return (
    <div style={{padding:'10px 0px',}} >
      <input className='input' placeholder={placeholder} type={type} value={value} onChange={onChange} name={name} id={id} autoComplete='on' />
    </div>
  )
}

export default InputCom
