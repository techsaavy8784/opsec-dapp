const Validators = ({ isActive = false }: { isActive?: boolean }) => {
  const fillColor = isActive ? "#F44336" : "#3F3F46"
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M16.19 2H7.82001C4.18001 2 2.01001 4.17 2.01001 7.81V16.18C2.01001 19.82 4.18001 21.99 7.82001 21.99H16.19C19.83 21.99 22 19.82 22 16.18V7.81C22 4.17 19.83 2 16.19 2Z"
        fill={fillColor}
      />
      <path
        d="M22 10.16H14.33C14.32 10.09 14.32 10.01 14.3 9.94C14.09 9.14 13.44 8.49001 12.64 8.28001C11.2 7.90001 9.89001 8.84001 9.67001 10.16H2V11.66H9.91C10.11 12.04 10.39 12.36 10.75 12.58V14.56C10.75 15.25 11.31 15.81 12 15.81C12.69 15.81 13.25 15.25 13.25 14.56V12.58C13.61 12.36 13.89 12.04 14.09 11.66H22V10.16Z"
        fill={fillColor}
      />
    </svg>
  )
}

export default Validators
