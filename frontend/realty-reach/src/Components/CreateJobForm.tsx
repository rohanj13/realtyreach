import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useToast,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import axios from 'axios';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  refreshJobs: () => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, userId, refreshJobs }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    userId: userId,
    jobType: '',
    additionalDetails: '',
    status: 'pending',
    jobDetail: {
      locationOrPostCode: '',
      purchaseType: '',
      propertyType: '',
      journeyProgress: '',
      budgetMin: 0,
      budgetMax: 0,
      contactEmail: '',
      contactPhone: ''
    }
  });

  const toast = useToast();

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    if (name in formData.jobDetail) {
      setFormData({
        ...formData,
        jobDetail: { ...formData.jobDetail, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    axios.post('/api/jobs', formData)
      .then(() => {
        toast({
          title: 'Job created successfully',
          status: 'success',
          isClosable: true,
        });
        refreshJobs();
        onClose();
      })
      .catch(error => {
        toast({
          title: 'Error creating job',
          description: error.response?.data.message || 'Failed to create job',
          status: 'error',
          isClosable: true,
        });
      });
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <FormControl>
            <FormLabel>Job Type</FormLabel>
            <Input name="jobType" value={formData.jobType} onChange={handleInputChange} />
          </FormControl>
        );
      case 1:
        return (
          <FormControl>
            <FormLabel>Additional Details</FormLabel>
            <Input name="additionalDetails" value={formData.additionalDetails} onChange={handleInputChange} />
          </FormControl>
        );
      // Add more cases for each step...
      default:
        return <p>Review and Confirm</p>; // Summary page or additional input
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Job</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {renderStepContent()}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handlePrev} disabled={step === 0}>
            Previous
          </Button>
          {step < 4 ? (
            <Button colorScheme="teal" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button colorScheme="green" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateJobModal;
