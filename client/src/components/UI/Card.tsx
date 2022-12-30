
// 카드 컴포넌트 테일윈드
const Card = ({ children, className }: any) => {
    return (
        <div className={`bg-white rounded-lg shadow-lg ${className}`}>
        {children}
        </div>
    );
};

export default Card;
