import Select, { components } from 'react-select'
import CreatableSelect from 'react-select/creatable'
// import Chevrondown from './icons/Chevrondown';
import { BiChevronDown } from 'react-icons/bi'

const CustomIcon = ({ active, disabled }: any) => {
  const activeClass = active ? 'border-blue-600' : 'border-gray-300'
  return (
    <div
      className={` ${activeClass} rounded-full border-4 p-1 h-3 w-3 text-transparent`}
    />
  )
}
const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <BiChevronDown
        className={`${
          props?.className?.includes('header') ? 'stroke-white' : 'stroke-black'
        } w-[10px] h-[5px] `}
      />
    </components.DropdownIndicator>
  )
}

const Option = (props: any) => {
  return props.selectProps.styled ? (
    <components.Option {...props}>
      <div className="flex items-center gap-4 relative !z-50">
        {props.selectProps.isMulti && (
          <input
            type="checkbox"
            className="mr-2"
            checked={props.isSelected}
            readOnly
          />
        )}
        <CustomIcon active={props.isSelected} />
        {props.data.label}
      </div>
    </components.Option>
  ) : (
    <components.Option {...props}>
      {props.selectProps.isMulti && (
        <input
          type="checkbox"
          className="mr-2"
          checked={props.isSelected}
          readOnly
        />
      )}
      {props.data.label}
    </components.Option>
  )
}

const ValueContainer = ({ children, inputClass = '', ...props }: any) => {
  if (!props.hasValue) {
    return props.selectProps.styled ? (
      <components.ValueContainer
        {...props}
        className={`mx-1 h-12 ${inputClass}`}
      >
        <div className="flex items-center font-medium gap-4">
          <CustomIcon />
          {children}
        </div>
      </components.ValueContainer>
    ) : (
      <components.ValueContainer {...props} className={`h-12 ${inputClass}`}>
        {children}
      </components.ValueContainer>
    )
  }
  return props.selectProps.styled ? (
    <components.ValueContainer {...props} className="mx-1">
      <div className="flex items-center font-medium gap-4">
        <CustomIcon active />
        {children}
      </div>
    </components.ValueContainer>
  ) : (
    <components.ValueContainer {...props}>{children}</components.ValueContainer>
  )
}
const RSelect = ({
  className = '',
  inputClass = '',
  labelClass = '',
  float,
  label,
  creatable,
  outline,
  height,
  bgCustom,
  ...props
}: any) => {
  const customStyles = {
    control: (styles: any, { isDisabled }: any) => {
      return {
        ...styles,
        borderColor: outline ? '#9480E0' : '#FFF',
        backgroundColor: bgCustom || '#FFF',
      }
    },
  }
  const customClass = {
    control: (state: any) => {
      const classBorder = state.isFocused
        ? 'border-red-600'
        : outline
          ? ''
          : '!border-0 text-start'

      return `${inputClass}  placeholder:text-secondary ${classBorder} `
    },
    menuPortal: ' !z-[50]',
  }

  return (
    <div className={`${float ? 'relative' : 'space-y-1'} ${className} `}>
      {!!label && (
        <label
          className={`${labelClass} ${float ? 'text-gray-400 text-xs bg-white absolute -top-2 left-2 z-[60]' : 'text-black'} font-semibold capitalize `}
        >
          {props.required ? <span className="mx-1 text-red-500">*</span> : null}
          {label}
        </label>
      )}
      {creatable ? (
        <CreatableSelect
          instanceId={props.name}
          components={{
            Option,
            DropdownIndicator,
            ValueContainer,
            IndicatorSeparator: () => null,
          }}
          className={`${className} h-12 `}
          styles={customStyles}
          classNames={customClass}
          isDisabled={props.disabled}
          {...props}
        />
      ) : (
        <Select
          isSearchable={false}
          instanceId={props.name}
          components={{
            Option,
            DropdownIndicator,
            ValueContainer,
            IndicatorSeparator: () => null,
          }}
          styles={customStyles}
          classNames={customClass}
          isDisabled={props.disabled}
          {...props}
        />
      )}
    </div>
  )
}
export default RSelect
