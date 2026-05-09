export default function Logo({ size = 32, color = 'currentColor' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M21 11.5C21 16.7467 16.7467 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 6.25329 6.25329 2 11.5 2" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <path 
        d="M22 2L11 13" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M15 13C15 15.2091 13.2091 17 11 17C8.79086 17 7 15.2091 7 13C7 10.7909 8.79086 9 11 9" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <path 
        d="M18 6C18 7.65685 16.6569 9 15 9C13.3431 9 12 7.65685 12 6C12 4.34315 13.3431 3 15 3C16.6569 3 18 4.34315 18 6Z" 
        stroke={color} 
        strokeWidth="1.5"
      />
    </svg>
  );
}
