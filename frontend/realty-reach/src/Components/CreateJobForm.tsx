import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  Text,
  HStack,
  RadioGroup,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Progress,
  Divider,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { PhoneIcon, MailIcon } from 'lucide-react';
import { createJob } from '../services/UserJobService';
import { CreateJobDto } from '../Models/Job';

interface FormData {
  jobType: 'Buy' | 'Sell';
  Postcode: string;
  purchaseType: string;
  propertyType: string;
  budgetMin: number;
  budgetMax: number;
  journeyProgress: string;
  additionalDetails: string;
  contactEmail: string;
  contactPhone: string;
}

interface JobFormProps {
  onClose: () => void; // Accept onClose prop
}

const JobCreationForm: React.FC<JobFormProps> = ({ onClose }) => {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [userId, setUserId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    jobType: 'Buy',
    Postcode: '',
    purchaseType: '',
    propertyType: '',
    budgetMin: 0,
    budgetMax: 0,
    journeyProgress: '',
    additionalDetails: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: 'Buy' | 'Sell') => {
    setFormData(prev => ({ ...prev, jobType: value }));
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const createJobDto: CreateJobDto = {
      JobType: formData.jobType,
      Postcode: formData.Postcode,
      PurchaseType: formData.purchaseType,
      PropertyType: formData.propertyType,
      BudgetMin: formData.budgetMin,
      BudgetMax: formData.budgetMax,
      JourneyProgress: formData.journeyProgress,
      AdditionalDetails: formData.additionalDetails,
      ContactEmail: formData.contactEmail,
      ContactPhone: formData.contactPhone,
    };

    try {
      const job = await createJob(createJobDto);
      toast({
        title: "Job Created Successfully",
        description: "We've received your job details and will process them shortly.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the job.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Box maxWidth="800px" margin="auto" padding={8} boxShadow="lg" borderRadius="xl" bg="white">
      <Heading as="h1" size="xl" textAlign="center" mb={6} color="blue.600">
        Create New Job
      </Heading>
      <Progress value={(step / totalSteps) * 100} mb={8} colorScheme="blue" borderRadius="full" />
      <form onSubmit={handleSubmit}>
        <VStack spacing={8} align="stretch">
          {step === 1 && (
            <>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">Step 1: Basic Information</Text>
              <FormControl isRequired>
                <FormLabel>Job Type</FormLabel>
                <RadioGroup value={formData.jobType} onChange={handleRadioChange}>
                  <HStack spacing={4}>
                    <Radio value="Buy" colorScheme="blue">Buy</Radio>
                    <Radio value="Sell" colorScheme="blue">Sell</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Job Location (Postcode)</FormLabel>
                <Input
                  name="Postcode"
                  value={formData.Postcode}
                  onChange={handleChange}
                  placeholder="Enter postcode"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Purchase Type</FormLabel>
                <Select
                  name="purchaseType"
                  value={formData.purchaseType}
                  onChange={handleChange}
                  placeholder="Select purchase type"
                >
                  <option value="firstHome">First Home</option>
                  <option value="investment">Investment Property</option>
                </Select>
              </FormControl>
            </>
          )}

          {step === 2 && (
            <>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">Step 2: Property Details</Text>
              <FormControl isRequired>
                <FormLabel>Property Type</FormLabel>
                <Select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  placeholder="Select property type"
                >
                  <option value="all">All</option>
                  <option value="house">House</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="apartment">Apartment & Unit</option>
                  <option value="villa">Villa</option>
                  <option value="retirement">Retirement Living</option>
                  <option value="land">Land</option>
                  <option value="acreage">Acreage</option>
                  <option value="rural">Rural</option>
                  <option value="blockOfUnits">Block of Units</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Budget</FormLabel>
                <HStack>
                  <NumberInput
                    min={0}
                    value={formData.budgetMin}
                    onChange={(_, value) => handleNumberChange('budgetMin', value)}
                  >
                    <NumberInputField placeholder="Min" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <NumberInput
                    min={0}
                    value={formData.budgetMax}
                    onChange={(_, value) => handleNumberChange('budgetMax', value)}
                  >
                    <NumberInputField placeholder="Max" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Journey Progress</FormLabel>
                <Select
                  name="journeyProgress"
                  value={formData.journeyProgress}
                  onChange={handleChange}
                  placeholder="Select journey progress"
                >
                  <option value="justStarted">Just Started</option>
                  <option value="preApproval">Pre-approval</option>
                  <option value="postPurchase">Post Purchase</option>
                </Select>
              </FormControl>
            </>
          )}

          {step === 3 && (
            <>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">Step 3: Additional Information</Text>
              <FormControl>
                <FormLabel>Additional Details</FormLabel>
                <Textarea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleChange}
                  placeholder="Enter any additional details"
                  rows={4}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Contact Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <MailIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter your email"
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Contact Phone</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <PhoneIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                </InputGroup>
              </FormControl>
            </>
          )}

          <Divider />

          <HStack justifyContent="space-between">
            {step > 1 && (
              <Button onClick={prevStep} colorScheme="gray">
                Previous
              </Button>
            )}
            {step < totalSteps ? (
              <Button onClick={nextStep} colorScheme="blue" ml="auto">
                Next
              </Button>
            ) : (
              <Button type="submit" colorScheme="green" ml="auto">
                Create Job
              </Button>
            )}
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default JobCreationForm;