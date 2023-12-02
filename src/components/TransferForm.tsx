import { ethers } from 'ethers';
import { useState } from 'react';
import TokenContract from '../../public/assets/abi/sender_abi.json';

const TransferForm: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();

      const contractAddress = '0x3abED60A4EdA4E32BdB71da5866894bC3b34623A'; // Matic 토큰 컨트랙트 주소
      const contractAbi = TokenContract; // 전송 함수에 대한 ABI

      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const tx = await contract.sendMessagePayLINK(12532609583862916517, '0xa2F99Bb25E704b9E4e56bFC2F88314b67698e25B','Jeongseup','0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05',10000000000000000);
      await tx.wait();

      alert('Transfer successful!');
    } catch (error) {
      console.error('Error transferring tokens:', error.message);
      alert('Error transferring tokens. Check the console for details.');
    }
  };

  return (
    <div>
      <h2>Token Transfer Form</h2>
      <label>
        Recipient Address:
        <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      </label>
      <br />
      <label>
        Amount:
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <br />
      <button onClick={handleTransfer}>Transfer Tokens</button>
    </div>
  );
};

export default TransferForm;
