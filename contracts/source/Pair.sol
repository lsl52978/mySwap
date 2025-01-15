// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleUniswapV2Pair is ERC20 {
    IERC20 public token0;
    IERC20 public token1;

    uint256 public reserve0;
    uint256 public reserve1;

    constructor() ERC20("LiquidityToken", "LPT") {}

    function initialize(address _token0, address _token1) external {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    function _updateReserves(uint256 _reserve0, uint256 _reserve1) private {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
    }

    function addLiquidity(
        uint256 amount0,
        uint256 amount1
    ) external returns (uint256 liquidity) {
        token0.transferFrom(msg.sender, address(this), amount0);
        token1.transferFrom(msg.sender, address(this), amount1);

        uint256 balance0 = token0.balanceOf(address(this));
        uint256 balance1 = token1.balanceOf(address(this));

        uint256 addedReserve0 = balance0 - reserve0;
        uint256 addedReserve1 = balance1 - reserve1;

        if (totalSupply() == 0) {
            liquidity = sqrt(addedReserve0 * addedReserve1);
        } else {
            liquidity = min(
                (addedReserve0 * totalSupply()) / reserve0,
                (addedReserve1 * totalSupply()) / reserve1
            );
        }

        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(msg.sender, liquidity);

        _updateReserves(balance0, balance1);
    }

    function removeLiquidity(
        uint256 liquidity
    ) external returns (uint256 amount0, uint256 amount1) {
        require(balanceOf(msg.sender) >= liquidity, "INSUFFICIENT_LIQUIDITY");

        uint256 totalLiquidity = totalSupply();

        amount0 = (liquidity * reserve0) / totalLiquidity;
        amount1 = (liquidity * reserve1) / totalLiquidity;

        require(amount0 > 0 && amount1 > 0, "INSUFFICIENT_LIQUIDITY_BURNED");

        _burn(msg.sender, liquidity);

        _updateReserves(reserve0 - amount0, reserve1 - amount1);

        token0.transfer(msg.sender, amount0);
        token1.transfer(msg.sender, amount1);
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenIn,
        address tokenOut,
        address to
    ) external {
        require(
            tokenIn == address(token0) || tokenIn == address(token1),
            "INVALID_TOKEN_IN"
        );
        require(
            tokenOut == address(token0) || tokenOut == address(token1),
            "INVALID_TOKEN_OUT"
        );
        require(tokenIn != tokenOut, "IDENTICAL_ADDRESSES");

        (
            IERC20 inputToken,
            IERC20 outputToken,
            uint256 inputReserve,
            uint256 outputReserve
        ) = tokenIn == address(token0)
                ? (token0, token1, reserve0, reserve1)
                : (token1, token0, reserve1, reserve0);

        inputToken.transferFrom(msg.sender, address(this), amountIn);
        uint256 inputBalance = inputToken.balanceOf(address(this));
        uint256 amountInWithFee = (inputBalance - inputReserve) * 997;
        uint256 numerator = amountInWithFee * outputReserve;
        uint256 denominator = inputReserve * 1000 + amountInWithFee;
        uint256 amountOut = numerator / denominator;

        require(amountOut >= amountOutMin, "INSUFFICIENT_OUTPUT_AMOUNT");

        outputToken.transfer(to, amountOut);

        _updateReserves(
            tokenIn == address(token0) ? inputBalance : reserve0,
            tokenIn == address(token0) ? reserve1 - amountOut : reserve1
        );
    }

    function getAmountsOut(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) external view returns (uint256 amountOut) {
        require(
            tokenIn == address(token0) || tokenIn == address(token1),
            "INVALID_TOKEN_IN"
        );
        require(
            tokenOut == address(token0) || tokenOut == address(token1),
            "INVALID_TOKEN_OUT"
        );
        require(tokenIn != tokenOut, "IDENTICAL_ADDRESSES");

        (uint256 inputReserve, uint256 outputReserve) = tokenIn ==
            address(token0)
            ? (reserve0, reserve1)
            : (reserve1, reserve0);

        uint256 amountInWithFee = amountIn * 997;
        uint256 numerator = amountInWithFee * outputReserve;
        uint256 denominator = inputReserve * 1000 + amountInWithFee;
        amountOut = numerator / denominator;
    }

    function sqrt(uint256 x) internal pure returns (uint256) {
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    function min(uint256 x, uint256 y) internal pure returns (uint256) {
        return x < y ? x : y;
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserve0, reserve1);
    }
}
