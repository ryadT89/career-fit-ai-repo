export function ProfileInput({onChange, defaultValue, placeholder, name} : {onChange: any, defaultValue: any, placeholder: any, name: any}) {
    return ( 
        <div>
            <label className="label font-bold">{placeholder}</label>
            <input type="text" onChange={onChange} defaultValue={defaultValue} className="input input-bordered w-full" placeholder={placeholder} name={name} />
        </div>
    )
}