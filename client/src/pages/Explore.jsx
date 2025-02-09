import { useState, useEffect } from 'react';
import '../index.css'
import { 
    Form, 
    Button, 
    Container, 
    Row, 
    Col, 
    Dropdown, 
    Spinner,
    ListGroup
} from 'react-bootstrap';
import { useLazyQuery, useQuery } from '@apollo/client';
import { 
    SEARCH_BY_NAME, 
    SEARCH_BY_TARGET, 
    SEARCH_BY_EQUIPMENT,
    SEARCH_BY_BODYPART,
    GET_TARGET_LIST,
    GET_EQUIPMENT_LIST,
    GET_BODYPART_LIST,
    GET_RANDOM_EXERCISES
} from '../utils/queries';
import ExerciseCard from '../components/ExerciseCard';

const ExplorePage = () => {
    // State for the search input text.
    const [searchText, setSearchText] = useState('');
    // States for the currently selected category values.
    const [selectedTarget, setSelectedTarget] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [selectedBodyPart, setSelectedBodyPart] = useState('');
    // State to track which type of search is active
    const [searchType, setSearchType] = useState('');
    // State for the current page index for pagination.
    const [pageIndex, setPageIndex] = useState(0);
    // State to store an overall error message.
    const [overallError, setOverallError] = useState('');

    // Lazy query for searching exercises by name.
    const [searchExercisesByName, { data: searchedByName, loading: loadingByName, error: searchByNameError }] = useLazyQuery(SEARCH_BY_NAME);
    // Lazy query for searching exercises by target muscle.
    const [searchExercisesByTarget, { data: searchedByTarget, loading: loadingByTarget, error: searchByTargetError }] = useLazyQuery(SEARCH_BY_TARGET);
    // Lazy query for searching exercises by equipment.
    const [searchExercisesByEquipment, { data: searchedByEquipment, loading: loadingByEquipment, error: searchByEquipmentError }] = useLazyQuery(SEARCH_BY_EQUIPMENT);
    // Lazy query for searching exercises by body part.
    const [searchExercisesByBodyPart, { data: searchedByBodyPart, loading: loadingByBodyPart, error: searchByBodyPartError }] = useLazyQuery(SEARCH_BY_BODYPART);
    // Query for retrieving the list of target muscles.
    const { data: targetListData, error: targetListError } = useQuery(GET_TARGET_LIST);
    // Query for retrieving the list of equipment.
    const { data: equipmentListData, error: equipmentListError } = useQuery(GET_EQUIPMENT_LIST);
    // Query for retrieving the list of body parts.
    const { data: bodyPartListData, error: bodyPartsListError } = useQuery(GET_BODYPART_LIST);
    // Query for retrieving random exercises
    const { data: randomExerciseData, loading: loadingRandomExercises, error: randomExerciseError } = useQuery(GET_RANDOM_EXERCISES)

    // Handler for input changes in the search bar.
    const handleInputChange = (event) => {
        setSearchText(event.target.value);
        setOverallError('');
    }

    // Handler for form submission when searching by name.
    const handleFormSubmit = (event) => {
        event.preventDefault();
        setPageIndex(0);
        setSelectedTarget('');
        setSelectedEquipment('');
        setSearchType('name');
        searchExercisesByName({ variables: { name: searchText, offset: 0 } });
    }

    // Handler for searching by target muscle via dropdown selection.
    const handleSearchByTarget = (target, offset = 0) => {
        setOverallError('');
        setSelectedTarget(target);
        setSearchText('');
        setSelectedEquipment('');
        setSearchType('target');
        searchExercisesByTarget({ variables: { target: target, offset: offset } });
    }

    // Handler for searching by equipment via dropdown selection.
    const handleSearchByEquipment = (equipment, offset = 0) => {
        setOverallError('');
        setSearchText('');
        setSelectedTarget('');
        setSelectedEquipment(equipment);
        setSearchType('equipment');
        searchExercisesByEquipment({ variables: { equipment: equipment, offset: offset } });
    }

    // Handler for searching by body part via dropdown selection.
    const handleSearchByBodyPart = (bodyPart, offset = 0) => {
        setOverallError('');
        setSearchText('');
        setSelectedTarget('');
        setSelectedEquipment('');
        setSelectedBodyPart(bodyPart);
        setSearchType('bodypart');
        searchExercisesByBodyPart({ variables: { bodyPart: bodyPart, offset: offset } });
    }

    // Handler for changing pages in the pagination.
    const handlePageChange = (newPageIndex) => {
        setPageIndex(newPageIndex);
        const offset = newPageIndex * 2;
        if (searchType === 'name') {
            searchExercisesByName({ variables: { name: searchText, offset } });
        } else if (searchType === 'target') {
            searchExercisesByTarget({ variables: { target: selectedTarget, offset } });
        } else if (searchType === 'equipment') {
            searchExercisesByEquipment({ variables: { equipment: selectedEquipment, offset: offset } });
        } else if (searchType === 'bodypart') {
            searchExercisesByBodyPart({ variables: { bodyPart: selectedBodyPart, offset: offset } });
        }
    };

    // Function to determine if any query is currently loading.
    const isLoading = () => {
        if (searchType === 'name') return loadingByName;
        if (searchType === 'target') return loadingByTarget;
        if (searchType === 'equipment') return loadingByEquipment;
        if (searchType === 'bodypart') return loadingByBodyPart;
        return loadingRandomExercises;
    };
    
    // Determine which exercises to display based on the active search type.
    const displayedExercises =
        searchType === 'name'
            ? searchedByName?.exercisesByName
            : searchType === 'target'
            ? searchedByTarget?.exercisesByTarget
            : searchType === 'equipment'
            ? searchedByEquipment?.exercisesByEquipment
            : searchType === 'bodypart'
            ? searchedByBodyPart?.exercisesByBodyPart
            : randomExerciseData?.randomExercises;

    // Function to check if there are any results.
    const areResults = () => {
        if (displayedExercises.length > 0) {
            return true;
        }
        return false;
    }

    // useEffect to update the overall error state when dependencies change.
    useEffect(() => {
        if (!searchType) {
            if (randomExerciseError) {
                setOverallError(randomExerciseError.message);
            }
        } else if (searchType === "name" && searchByNameError) {
            setOverallError(searchByNameError.message);
        } else if (searchType === "target" && searchByTargetError) {
            setOverallError(searchByTargetError.message);
        } else if (searchType === "equipment" && searchByEquipmentError) {
            setOverallError(searchByEquipmentError.message);
        } else if (searchType === "bodypart" && searchByBodyPartError) {
            setOverallError(searchByBodyPartError.message);
        } else if (!isLoading() && searchType && (!displayedExercises || displayedExercises.length === 0)) {
            setOverallError("No exercises found for your search criteria.");
        }
    }, [
        searchType,
        randomExerciseError,
        searchByNameError,
        searchByTargetError,
        searchByEquipmentError,
        searchByBodyPartError,
        displayedExercises,
        loadingByName,
        loadingByTarget,
        loadingByEquipment,
        loadingByBodyPart,
        loadingRandomExercises,
    ]);

    return (
        <>
            <h1 className='mb-3'>Explore</h1>
            <Container fluid className='p-md-3'>
                <Row>
                    {/* Categories Column */}
                    <Col xs={12} md={4} lg={3}>
                        <Container>
                            <h2>Categories</h2>
                            <ListGroup className="mb-3" variant="flush">
                                {/* Target Muscles Category */}
                                <ListGroup.Item className="bg-white border-0 py-3">
                                    <h4 className="mb-2">Target Muscles</h4>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-primary" id="dropdown-target">
                                            {selectedTarget
                                                ? selectedTarget.charAt(0).toUpperCase() + selectedTarget.slice(1)
                                                : 'Select Target Muscle'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {targetListData &&
                                                targetListData.targetList &&
                                                targetListData.targetList.map((target, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    onClick={() => {
                                                    handleSearchByTarget(target, 0);
                                                    setPageIndex(0);
                                                    }}
                                                >
                                                    {target.charAt(0).toUpperCase() + target.slice(1)}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </ListGroup.Item>

                                {/* Equipment Category */}
                                <ListGroup.Item className="bg-white border-0 py-3">
                                    <h4 className="mb-2">Equipment</h4>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-primary" id="dropdown-equipment">
                                            {selectedEquipment
                                                ? selectedEquipment.charAt(0).toUpperCase() + selectedEquipment.slice(1)
                                                : 'Select Equipment'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {equipmentListData &&
                                                equipmentListData.equipmentList &&
                                                equipmentListData.equipmentList.map((equipment, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    onClick={() => {
                                                    handleSearchByEquipment(equipment, 0);
                                                    setPageIndex(0);
                                                    }}
                                                >
                                                    {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </ListGroup.Item>

                                {/* Body Parts Category */}
                                <ListGroup.Item className="bg-white border-0 py-3">
                                    <h4 className="mb-2">Body Parts</h4>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-primary" id="dropdown-bodypart">
                                            {selectedBodyPart
                                                ? selectedBodyPart.charAt(0).toUpperCase() + selectedBodyPart.slice(1)
                                                : 'Select Body Part'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {bodyPartListData &&
                                                bodyPartListData.bodyPartList &&
                                                bodyPartListData.bodyPartList.map((bodyPart, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    onClick={() => {
                                                    handleSearchByBodyPart(bodyPart, 0);
                                                    setPageIndex(0);
                                                    }}
                                                >
                                                    {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </ListGroup.Item>
                            </ListGroup>
                        </Container>
                    </Col>
                    
                    {/* Main Content Column */}
                    <Col xs={12} md={8} lg={9}>
                        <Form onSubmit={handleFormSubmit} className='d-flex mb-3'>
                            <Form.Group className='me-3 w-100'>
                                <Form.Control 
                                    type='text' 
                                    placeholder='Search for an exercise...'
                                    name='exercise-search' 
                                    onChange={handleInputChange}
                                    value={searchText}
                                />
                            </Form.Group>
                            <Button type='submit'>Submit</Button>
                        </Form>
                        {/* Display loading spinner, error message, or the exercise cards */}
                        {isLoading() ? (
                            <Container className="text-center my-3">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </Container>
                        ) : overallError ? (
                            <p className="text-danger">{overallError}</p>
                        ) : (
                            <ExerciseCard data={displayedExercises} />
                        )}
                    </Col>
                </Row>
            </Container>
            
            {/* Pagination Buttons */}
            {searchType && displayedExercises && areResults() && !isLoading() && (
                <Container className="text-center">
                    {[0, 1, 2, 3, 4].map((page) => (
                        <Button
                            key={page}
                            variant={pageIndex === page ? "primary" : "secondary"}
                            onClick={() => handlePageChange(page)}
                            className="me-2"
                        >
                            {page + 1}
                        </Button>
                    ))}
                </Container>
            )}
        </>
    );
};

export default ExplorePage;