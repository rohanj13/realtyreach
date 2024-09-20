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
  VStack,
  HStack,
  RadioGroup,
  Radio,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobDetails: any) => void;
}

const JobModal = ({ isOpen, onClose, onSubmit }: JobModalProps) => {
  const [step, setStep] = useState(1);
  const [jobType, setJobType] = useState("Buy");
  const [location, setLocation] = useState("");
  const [purchaseType, setPurchaseType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [journeyProgress, setJourneyProgress] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const toast = useToast();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    const jobDetails = {
      jobType,
      location,
      purchaseType,
      propertyType,
      journeyProgress,
      budgetMin,
      budgetMax,
      contactEmail,
      contactPhone,
    };

    if (!contactEmail || !contactPhone) {
      toast({
        title: "Please fill in contact details.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    onSubmit(jobDetails);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Job</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {step === 1 && (
            <VStack spacing={4}>
              <RadioGroup onChange={setJobType} value={jobType}>
                <HStack spacing={4}>
                  <Radio value="Buy">Buy</Radio>
                  <Radio value="Sell">Sell</Radio>
                </HStack>
              </RadioGroup>
              <Input
                placeholder="Location (Postcode)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </VStack>
          )}

          {step === 2 && (
            <VStack spacing={4}>
              <Select
                             
                onChange={(e) => setPurchaseType(e.target.value)}
              >
                <option value="First home">First home</option>
                <option value="Investment property">Investment property</option>
              </Select>
            </VStack>
          )}

          {step === 3 && (
            <VStack spacing={4}>
              <Input
                placeholder="Property Type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              />
            </VStack>
          )}

          {step === 4 && (
            <VStack spacing={4}>
              <Select
                value={journeyProgress}
                onChange={(e) => setJourneyProgress(e.target.value)}
              >
                <option value="Just started">Just started</option>
                <option value="Have pre-approval">Have pre-approval</option>
                <option value="Post purchase">Post purchase</option>
              </Select>
            </VStack>
          )}

          {step === 5 && (
            <VStack spacing={4}>
              <Input
                placeholder="Budget Min"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
              />
              <Input
                placeholder="Budget Max"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
              />
            </VStack>
          )}

          {step === 6 && (
            <VStack spacing={4}>
              <Input
                placeholder="Contact Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <Input
                placeholder="Contact Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {step > 1 && (
            <Button variant="ghost" onClick={prevStep} mr={3}>
              Back
            </Button>
          )}
          {step < 6 ? (
            <Button colorScheme="blue" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button colorScheme="blue" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JobModal;